package com.liquidthoughts.blog.security;

import com.liquidthoughts.blog.common.BizException;
import com.liquidthoughts.blog.common.ErrorCode;
import com.liquidthoughts.blog.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    public static final String REQUEST_USERNAME_ATTR = "auth_username";

    private final AuthService authService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        if (isPublicRequest(request)) {
            return true;
        }

        String username = authService.resolveUsername(request);
        if (username == null) {
            throw new BizException(ErrorCode.UNAUTHORIZED);
        }

        request.setAttribute(REQUEST_USERNAME_ATTR, username);
        return true;
    }

    private boolean isPublicRequest(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        if (uri.startsWith("/api/auth/")) {
            return true;
        }

        if (HttpMethod.GET.matches(method)) {
            return uri.equals("/api/posts")
                    || uri.equals("/api/categories")
                    || uri.equals("/api/configs")
                    || uri.equals("/api/posts/page")
                    || uri.equals("/api/categories/page");
        }

        if (HttpMethod.POST.matches(method)) {
            return uri.matches("^/api/posts/[^/]+/(view|like|unlike)$");
        }

        return false;
    }
}

package com.liquidthoughts.blog.controller;

import com.liquidthoughts.blog.common.ApiResponse;
import com.liquidthoughts.blog.common.BizException;
import com.liquidthoughts.blog.common.ErrorCode;
import com.liquidthoughts.blog.dto.LoginRequest;
import com.liquidthoughts.blog.dto.LoginResponse;
import com.liquidthoughts.blog.dto.SessionStatusResponse;
import com.liquidthoughts.blog.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Admin login")
    public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        String token = authService.login(request.getUsername(), request.getPassword());
        if (token == null) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "Invalid username or password");
        }
        return ApiResponse.success("Login success", new LoginResponse(token, request.getUsername()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout")
    public ApiResponse<Void> logout(HttpServletRequest request) {
        authService.logout(request);
        return ApiResponse.success("Logout success", null);
    }

    @GetMapping("/session")
    @Operation(summary = "Get current session status")
    public ApiResponse<SessionStatusResponse> session(HttpServletRequest request) {
        String username = authService.resolveUsername(request);
        return ApiResponse.success(new SessionStatusResponse(username != null, username));
    }
}

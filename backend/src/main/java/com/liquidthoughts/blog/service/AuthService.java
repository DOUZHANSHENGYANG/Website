package com.liquidthoughts.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.liquidthoughts.blog.entity.AdminUserEntity;
import com.liquidthoughts.blog.mapper.AdminUserMapper;
import com.liquidthoughts.blog.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String AUTHORIZATION = "Authorization";
    private static final String PREFIX = "Bearer ";

    private final AdminUserMapper adminUserMapper;
    private final JwtService jwtService;

    private final Set<String> revokedTokens = ConcurrentHashMap.newKeySet();

    public String login(String username, String password) {
        AdminUserEntity user = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUserEntity>()
                        .eq(AdminUserEntity::getUsername, username)
                        .eq(AdminUserEntity::getPassword, password)
        );
        if (user == null) {
            return null;
        }
        return jwtService.generateToken(username);
    }

    public void logout(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            revokedTokens.add(token);
        }
    }

    public String resolveUsername(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null || revokedTokens.contains(token)) {
            return null;
        }

        try {
            return jwtService.parseUsername(token);
        } catch (Exception ex) {
            return null;
        }
    }

    public boolean isLoggedIn(HttpServletRequest request) {
        return resolveUsername(request) != null;
    }

    private String extractToken(HttpServletRequest request) {
        String authorization = request.getHeader(AUTHORIZATION);
        if (authorization == null || authorization.isBlank() || !authorization.startsWith(PREFIX)) {
            return null;
        }
        return authorization.substring(PREFIX.length()).trim();
    }
}

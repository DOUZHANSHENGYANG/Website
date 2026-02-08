package com.liquidthoughts.blog.controller;

import com.liquidthoughts.blog.common.ApiResponse;
import com.liquidthoughts.blog.dto.ConfigUpdateRequest;
import com.liquidthoughts.blog.entity.ConfigEntity;
import com.liquidthoughts.blog.service.ConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/configs")
@RequiredArgsConstructor
@Tag(name = "Configs")
public class ConfigController {

    private final ConfigService configService;

    @GetMapping
    @Operation(summary = "Get config list")
    public ApiResponse<List<ConfigEntity>> list() {
        return ApiResponse.success(configService.listAll());
    }

    @PostMapping("/{key}")
    @Operation(summary = "Update config")
    public ApiResponse<ConfigEntity> update(@PathVariable String key,
                                            @RequestBody @Valid ConfigUpdateRequest request) {
        return ApiResponse.success("Save success", configService.updateByKey(key, request));
    }
}

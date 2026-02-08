package com.liquidthoughts.blog.controller;

import com.liquidthoughts.blog.common.ApiResponse;
import com.liquidthoughts.blog.dto.AssetUploadResponse;
import com.liquidthoughts.blog.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@Tag(name = "Assets")
public class AssetController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload one or multiple assets")
    public ApiResponse<List<AssetUploadResponse>> upload(@RequestParam("files") MultipartFile[] files,
                                                         @RequestParam(required = false) String folder) {
        return ApiResponse.success("Upload success", fileStorageService.storeAssets(files, folder));
    }
}


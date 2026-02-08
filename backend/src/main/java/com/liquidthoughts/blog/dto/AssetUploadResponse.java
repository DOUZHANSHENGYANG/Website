package com.liquidthoughts.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AssetUploadResponse {

    private String originalName;
    private String url;
    private String relativePath;
    private long size;
}


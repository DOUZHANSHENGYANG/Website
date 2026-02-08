package com.liquidthoughts.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PostSaveRequest {

    private String id;

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "content is required")
    private String content;

    @NotBlank(message = "summary is required")
    private String summary;

    @NotBlank(message = "status is required")
    @Pattern(regexp = "draft|published", message = "status must be draft or published")
    private String status;

    @NotNull(message = "category_id is required")
    private Integer categoryId;
}

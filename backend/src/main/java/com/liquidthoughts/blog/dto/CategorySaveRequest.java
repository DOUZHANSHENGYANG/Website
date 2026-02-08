package com.liquidthoughts.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategorySaveRequest {

    private Integer id;

    @NotBlank(message = "name is required")
    private String name;

    private String slug;

    private String description;

    private String icon;

    private String color;
}

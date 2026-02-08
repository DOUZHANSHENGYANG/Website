package com.liquidthoughts.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfigUpdateRequest {

    @NotBlank(message = "value is required")
    private String value;

    private String type;
}

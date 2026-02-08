package com.liquidthoughts.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostMetricResponse {

    private String postId;

    private Integer viewCount;

    private Integer likeCount;
}

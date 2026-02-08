package com.liquidthoughts.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PagedResponse<T> {

    private List<T> records;
    private long total;
    private long page;
    private long pageSize;
}

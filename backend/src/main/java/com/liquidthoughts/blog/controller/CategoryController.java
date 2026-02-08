package com.liquidthoughts.blog.controller;

import com.liquidthoughts.blog.common.ApiResponse;
import com.liquidthoughts.blog.dto.CategorySaveRequest;
import com.liquidthoughts.blog.dto.PagedResponse;
import com.liquidthoughts.blog.entity.CategoryEntity;
import com.liquidthoughts.blog.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get category list")
    public ApiResponse<List<CategoryEntity>> list() {
        return ApiResponse.success(categoryService.listAll());
    }

    @GetMapping("/page")
    @Operation(summary = "Get category page")
    public ApiResponse<PagedResponse<CategoryEntity>> page(@RequestParam(defaultValue = "1") long page,
                                                           @RequestParam(name = "page_size", defaultValue = "10") long pageSize,
                                                           @RequestParam(required = false) String keyword,
                                                           @RequestParam(required = false) String slug) {
        return ApiResponse.success(categoryService.listPage(page, pageSize, keyword, slug));
    }

    @PostMapping
    @Operation(summary = "Create or update category")
    public ApiResponse<CategoryEntity> save(@RequestBody @Valid CategorySaveRequest request) {
        return ApiResponse.success("Save success", categoryService.save(request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        categoryService.deleteById(id);
        return ApiResponse.success("Delete success", null);
    }
}

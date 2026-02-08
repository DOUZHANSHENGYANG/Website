package com.liquidthoughts.blog.controller;

import com.liquidthoughts.blog.common.ApiResponse;
import com.liquidthoughts.blog.dto.PagedResponse;
import com.liquidthoughts.blog.dto.PostMetricResponse;
import com.liquidthoughts.blog.dto.PostSaveRequest;
import com.liquidthoughts.blog.entity.PostEntity;
import com.liquidthoughts.blog.service.PostMetricService;
import com.liquidthoughts.blog.service.PostService;
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
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Posts")
public class PostController {

    private final PostService postService;
    private final PostMetricService postMetricService;

    @GetMapping
    @Operation(summary = "Get post list")
    public ApiResponse<List<PostEntity>> list() {
        return ApiResponse.success(postService.listAll());
    }

    @GetMapping("/page")
    @Operation(summary = "Get post page")
    public ApiResponse<PagedResponse<PostEntity>> page(@RequestParam(defaultValue = "1") long page,
                                                       @RequestParam(name = "page_size", defaultValue = "10") long pageSize,
                                                       @RequestParam(required = false) String keyword,
                                                       @RequestParam(required = false) String status,
                                                       @RequestParam(name = "category_id", required = false) Integer categoryId,
                                                       @RequestParam(name = "created_from", required = false) String createdFrom,
                                                       @RequestParam(name = "created_to", required = false) String createdTo,
                                                       @RequestParam(name = "updated_from", required = false) String updatedFrom,
                                                       @RequestParam(name = "updated_to", required = false) String updatedTo) {
        return ApiResponse.success(postService.listPage(page, pageSize, keyword, status, categoryId, createdFrom, createdTo, updatedFrom, updatedTo));
    }

    @PostMapping
    @Operation(summary = "Create or update post")
    public ApiResponse<PostEntity> save(@RequestBody @Valid PostSaveRequest request) {
        return ApiResponse.success("Save success", postService.save(request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete post")
    public ApiResponse<Void> delete(@PathVariable String id) {
        postService.deleteById(id);
        return ApiResponse.success("Delete success", null);
    }

    @PostMapping("/{id}/view")
    @Operation(summary = "Increase post view count")
    public ApiResponse<PostMetricResponse> increaseView(@PathVariable String id) {
        return ApiResponse.success(postMetricService.incrementView(id));
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "Increase post like count")
    public ApiResponse<PostMetricResponse> increaseLike(@PathVariable String id) {
        return ApiResponse.success(postMetricService.incrementLike(id));
    }

    @PostMapping("/{id}/unlike")
    @Operation(summary = "Decrease post like count")
    public ApiResponse<PostMetricResponse> decreaseLike(@PathVariable String id) {
        return ApiResponse.success(postMetricService.decrementLike(id));
    }
}

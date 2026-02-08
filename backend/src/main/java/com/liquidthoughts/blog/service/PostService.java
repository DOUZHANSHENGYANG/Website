package com.liquidthoughts.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.liquidthoughts.blog.common.BizException;
import com.liquidthoughts.blog.common.ErrorCode;
import com.liquidthoughts.blog.dto.PagedResponse;
import com.liquidthoughts.blog.dto.PostSaveRequest;
import com.liquidthoughts.blog.entity.PostEntity;
import com.liquidthoughts.blog.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;
    private final FileStorageService fileStorageService;
    private final PostMetricService postMetricService;

    public List<PostEntity> listAll() {
        List<PostEntity> posts = postMapper.selectList(
                new LambdaQueryWrapper<PostEntity>().orderByDesc(PostEntity::getCreatedAt)
        );
        postMetricService.attachMetrics(posts);
        return posts;
    }

    public PagedResponse<PostEntity> listPage(long page,
                                              long pageSize,
                                              String keyword,
                                              String status,
                                              Integer categoryId,
                                              String createdFrom,
                                              String createdTo,
                                              String updatedFrom,
                                              String updatedTo) {
        LambdaQueryWrapper<PostEntity> wrapper = new LambdaQueryWrapper<PostEntity>()
                .orderByDesc(PostEntity::getCreatedAt);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(PostEntity::getTitle, keyword).or().like(PostEntity::getSummary, keyword));
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(PostEntity::getStatus, status);
        }
        if (categoryId != null) {
            wrapper.eq(PostEntity::getCategoryId, categoryId);
        }

        String normalizedCreatedFrom = normalizeDateTimeStart(createdFrom);
        String normalizedCreatedTo = normalizeDateTimeEnd(createdTo);
        String normalizedUpdatedFrom = normalizeDateTimeStart(updatedFrom);
        String normalizedUpdatedTo = normalizeDateTimeEnd(updatedTo);

        if (normalizedCreatedFrom != null) {
            wrapper.ge(PostEntity::getCreatedAt, normalizedCreatedFrom);
        }
        if (normalizedCreatedTo != null) {
            wrapper.le(PostEntity::getCreatedAt, normalizedCreatedTo);
        }
        if (normalizedUpdatedFrom != null) {
            wrapper.ge(PostEntity::getUpdatedAt, normalizedUpdatedFrom);
        }
        if (normalizedUpdatedTo != null) {
            wrapper.le(PostEntity::getUpdatedAt, normalizedUpdatedTo);
        }

        Page<PostEntity> result = postMapper.selectPage(Page.of(page, pageSize), wrapper);
        postMetricService.attachMetrics(result.getRecords());
        return new PagedResponse<>(result.getRecords(), result.getTotal(), result.getCurrent(), result.getSize());
    }

    private String normalizeDateTimeStart(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String trimmed = value.trim();
        try {
            return Instant.parse(trimmed).toString();
        } catch (Exception ignored) {
            // Ignore and try parsing date only.
        }

        try {
            return LocalDate.parse(trimmed).atStartOfDay(ZoneOffset.UTC).toInstant().toString();
        } catch (Exception ignored) {
            return null;
        }
    }

    private String normalizeDateTimeEnd(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String trimmed = value.trim();
        try {
            return Instant.parse(trimmed).toString();
        } catch (Exception ignored) {
            // Ignore and try parsing date only.
        }

        try {
            return LocalDate.parse(trimmed)
                    .plusDays(1)
                    .atStartOfDay(ZoneOffset.UTC)
                    .minusNanos(1)
                    .toInstant()
                    .toString();
        } catch (Exception ignored) {
            return null;
        }
    }

    public PostEntity save(PostSaveRequest request) {
        String now = Instant.now().toString();

        if (request.getId() == null || request.getId().isBlank()) {
            PostEntity entity = new PostEntity();
            entity.setId(String.valueOf(System.currentTimeMillis()));
            entity.setTitle(request.getTitle());
            entity.setContent(request.getContent());
            entity.setSummary(request.getSummary());
            entity.setStatus(request.getStatus());
            entity.setCategoryId(request.getCategoryId());
            entity.setCreatedAt(now);
            entity.setUpdatedAt(now);
            postMapper.insert(entity);
            fileStorageService.writePostMarkdown(entity.getId(), entity.getContent());
            postMetricService.initMetricIfAbsent(entity.getId());
            entity.setViewCount(0);
            entity.setLikeCount(0);
            return entity;
        }

        PostEntity entity = postMapper.selectById(request.getId());
        boolean exists = entity != null;
        if (entity == null) {
            entity = new PostEntity();
            entity.setId(request.getId());
            entity.setCreatedAt(now);
        }
        entity.setTitle(request.getTitle());
        entity.setContent(request.getContent());
        entity.setSummary(request.getSummary());
        entity.setStatus(request.getStatus());
        entity.setCategoryId(request.getCategoryId());
        entity.setUpdatedAt(now);

        if (!exists) {
            postMapper.insert(entity);
        } else {
            postMapper.updateById(entity);
        }

        fileStorageService.writePostMarkdown(entity.getId(), entity.getContent());
        postMetricService.initMetricIfAbsent(entity.getId());
        postMetricService.attachMetrics(List.of(entity));
        return entity;
    }

    public void deleteById(String id) {
        int rows = postMapper.deleteById(id);
        if (rows == 0) {
            throw new BizException(ErrorCode.NOT_FOUND, "Post not found");
        }
        fileStorageService.deletePostMarkdown(id);
    }
}

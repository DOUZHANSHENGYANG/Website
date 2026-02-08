package com.liquidthoughts.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.liquidthoughts.blog.common.BizException;
import com.liquidthoughts.blog.common.ErrorCode;
import com.liquidthoughts.blog.dto.PostMetricResponse;
import com.liquidthoughts.blog.entity.PostEntity;
import com.liquidthoughts.blog.entity.PostMetricEntity;
import com.liquidthoughts.blog.mapper.PostMapper;
import com.liquidthoughts.blog.mapper.PostMetricMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostMetricService {

    private final PostMetricMapper postMetricMapper;
    private final PostMapper postMapper;

    public void attachMetrics(List<PostEntity> posts) {
        if (posts == null || posts.isEmpty()) {
            return;
        }

        List<String> postIds = posts.stream()
                .map(PostEntity::getId)
                .filter(Objects::nonNull)
                .toList();

        if (postIds.isEmpty()) {
            posts.forEach(post -> fillPostMetric(post, null));
            return;
        }

        List<PostMetricEntity> metrics = postMetricMapper.selectList(
                new LambdaQueryWrapper<PostMetricEntity>().in(PostMetricEntity::getPostId, postIds)
        );
        Map<String, PostMetricEntity> metricMap = metrics.stream()
                .collect(Collectors.toMap(PostMetricEntity::getPostId, item -> item, (a, b) -> b));

        posts.forEach(post -> fillPostMetric(post, metricMap.get(post.getId())));
    }

    public void initMetricIfAbsent(String postId) {
        if (postId == null || postId.isBlank()) {
            return;
        }
        PostMetricEntity metric = postMetricMapper.selectById(postId);
        if (metric != null) {
            return;
        }

        PostMetricEntity entity = new PostMetricEntity();
        entity.setPostId(postId);
        entity.setViewCount(0);
        entity.setLikeCount(0);
        entity.setUpdatedAt(Instant.now().toString());
        try {
            postMetricMapper.insert(entity);
        } catch (DuplicateKeyException ignored) {
            // Ignore race condition when multiple requests initialize metric concurrently.
        }
    }

    public PostMetricResponse incrementView(String postId) {
        ensurePostExists(postId);
        return incrementAndFetch(postId, postMetricMapper::incrementView, 1, 0);
    }

    public PostMetricResponse incrementLike(String postId) {
        ensurePostExists(postId);
        return incrementAndFetch(postId, postMetricMapper::incrementLike, 0, 1);
    }

    public PostMetricResponse decrementLike(String postId) {
        ensurePostExists(postId);
        initMetricIfAbsent(postId);
        postMetricMapper.decrementLike(postId, Instant.now().toString());
        PostMetricEntity metric = postMetricMapper.selectById(postId);
        if (metric == null) {
            return new PostMetricResponse(postId, 0, 0);
        }
        return new PostMetricResponse(
                postId,
                safeNumber(metric.getViewCount()),
                safeNumber(metric.getLikeCount())
        );
    }

    private PostMetricResponse incrementAndFetch(String postId,
                                                 MetricIncrementFunction incrementFunction,
                                                 int defaultView,
                                                 int defaultLike) {
        String now = Instant.now().toString();
        int affectedRows = incrementFunction.apply(postId, now);
        if (affectedRows == 0) {
            PostMetricEntity entity = new PostMetricEntity();
            entity.setPostId(postId);
            entity.setViewCount(defaultView);
            entity.setLikeCount(defaultLike);
            entity.setUpdatedAt(now);
            try {
                postMetricMapper.insert(entity);
            } catch (DuplicateKeyException ignored) {
                incrementFunction.apply(postId, now);
            }
        }

        PostMetricEntity metric = postMetricMapper.selectById(postId);
        if (metric == null) {
            return new PostMetricResponse(postId, 0, 0);
        }
        return new PostMetricResponse(
                postId,
                safeNumber(metric.getViewCount()),
                safeNumber(metric.getLikeCount())
        );
    }

    private void ensurePostExists(String postId) {
        if (postId == null || postId.isBlank() || postMapper.selectById(postId) == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "Post not found");
        }
    }

    private void fillPostMetric(PostEntity post, PostMetricEntity metric) {
        if (post == null) {
            return;
        }
        post.setViewCount(safeNumber(metric == null ? null : metric.getViewCount()));
        post.setLikeCount(safeNumber(metric == null ? null : metric.getLikeCount()));
    }

    private int safeNumber(Integer value) {
        return value == null ? 0 : value;
    }

    private interface MetricIncrementFunction {
        int apply(String postId, String updatedAt);
    }
}

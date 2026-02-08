package com.liquidthoughts.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.liquidthoughts.blog.common.BizException;
import com.liquidthoughts.blog.common.ErrorCode;
import com.liquidthoughts.blog.dto.CategorySaveRequest;
import com.liquidthoughts.blog.dto.PagedResponse;
import com.liquidthoughts.blog.entity.CategoryEntity;
import com.liquidthoughts.blog.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;

    public List<CategoryEntity> listAll() {
        return categoryMapper.selectList(
                new LambdaQueryWrapper<CategoryEntity>().orderByAsc(CategoryEntity::getId)
        );
    }

    public PagedResponse<CategoryEntity> listPage(long page, long pageSize, String keyword, String slug) {
        LambdaQueryWrapper<CategoryEntity> wrapper = new LambdaQueryWrapper<CategoryEntity>()
                .orderByAsc(CategoryEntity::getId);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(CategoryEntity::getName, keyword).or().like(CategoryEntity::getDescription, keyword));
        }
        if (StringUtils.hasText(slug)) {
            wrapper.like(CategoryEntity::getSlug, slug);
        }

        Page<CategoryEntity> result = categoryMapper.selectPage(Page.of(page, pageSize), wrapper);
        return new PagedResponse<>(result.getRecords(), result.getTotal(), result.getCurrent(), result.getSize());
    }

    public CategoryEntity save(CategorySaveRequest request) {
        if (request.getId() == null) {
            CategoryEntity entity = new CategoryEntity();
            entity.setName(request.getName());
            entity.setSlug(buildSlug(request.getSlug(), request.getName()));
            entity.setDescription(defaultString(request.getDescription()));
            entity.setIcon(defaultIcon(request.getIcon()));
            entity.setColor(defaultColor(request.getColor()));
            categoryMapper.insert(entity);
            return entity;
        }

        CategoryEntity entity = categoryMapper.selectById(request.getId());
        boolean exists = entity != null;
        if (entity == null) {
            entity = new CategoryEntity();
            entity.setId(request.getId());
        }
        entity.setName(request.getName());
        entity.setSlug(buildSlug(request.getSlug(), request.getName()));
        entity.setDescription(defaultString(request.getDescription()));
        entity.setIcon(defaultIcon(request.getIcon()));
        entity.setColor(defaultColor(request.getColor()));

        if (!exists) {
            categoryMapper.insert(entity);
        } else {
            categoryMapper.updateById(entity);
        }
        return entity;
    }

    public void deleteById(Integer id) {
        int rows = categoryMapper.deleteById(id);
        if (rows == 0) {
            throw new BizException(ErrorCode.NOT_FOUND, "Category not found");
        }
    }

    private String buildSlug(String slug, String name) {
        if (slug != null && !slug.isBlank()) {
            return slug.trim();
        }
        return name.toLowerCase().trim().replaceAll("\\s+", "-");
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }

    private String defaultIcon(String icon) {
        return (icon == null || icon.isBlank()) ? "folder" : icon;
    }

    private String defaultColor(String color) {
        return (color == null || color.isBlank()) ? "#195de6" : color;
    }
}

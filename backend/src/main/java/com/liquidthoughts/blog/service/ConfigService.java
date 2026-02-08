package com.liquidthoughts.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.liquidthoughts.blog.dto.ConfigUpdateRequest;
import com.liquidthoughts.blog.entity.ConfigEntity;
import com.liquidthoughts.blog.mapper.ConfigMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConfigService {

    private final ConfigMapper configMapper;

    public List<ConfigEntity> listAll() {
        return configMapper.selectList(
                new LambdaQueryWrapper<ConfigEntity>().orderByAsc(ConfigEntity::getKey)
        );
    }

    public ConfigEntity updateByKey(String key, ConfigUpdateRequest request) {
        ConfigEntity entity = configMapper.selectById(key);
        if (entity == null) {
            entity = new ConfigEntity();
            entity.setKey(key);
            entity.setType(resolveType(key, request.getType()));
            entity.setValue(request.getValue());
            configMapper.insert(entity);
            return entity;
        }

        entity.setValue(request.getValue());
        if (request.getType() != null && !request.getType().isBlank()) {
            entity.setType(request.getType());
        }
        configMapper.updateById(entity);
        return entity;
    }

    private String resolveType(String key, String type) {
        if (type != null && !type.isBlank()) {
            return type;
        }
        return ("admin_bio".equals(key)
                || "avatar".equals(key)
                || "author_name".equals(key)
                || "author_title".equals(key)) ? "PERSONAL_INFO" : "WEBSITE_SETTINGS";
    }
}

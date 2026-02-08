package com.liquidthoughts.blog.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    /**
     * Local root path for uploaded assets and generated markdown snapshots.
     */
    private String rootPath = "./storage";

    /**
     * Sub directory used for uploaded images.
     */
    private String uploadSubDir = "uploads";

    /**
     * Sub directory used for markdown backups.
     */
    private String postMarkdownDir = "posts";
}


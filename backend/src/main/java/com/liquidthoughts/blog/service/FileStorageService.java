package com.liquidthoughts.blog.service;

import com.liquidthoughts.blog.common.BizException;
import com.liquidthoughts.blog.common.ErrorCode;
import com.liquidthoughts.blog.config.StorageProperties;
import com.liquidthoughts.blog.dto.AssetUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyyMM");

    private final StorageProperties storageProperties;

    public List<AssetUploadResponse> storeAssets(MultipartFile[] files, String folderHint) {
        if (files == null || files.length == 0) {
            throw new BizException(ErrorCode.BAD_REQUEST, "No files uploaded");
        }

        String targetFolder = StringUtils.hasText(folderHint)
                ? sanitizeFolder(folderHint)
                : "articles/" + LocalDate.now().format(MONTH_FORMATTER);

        Path uploadDir = buildUploadDirectory(targetFolder);
        ensureDirectory(uploadDir);

        List<AssetUploadResponse> results = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            String safeOriginalName = sanitizeFilename(file.getOriginalFilename());
            String extension = extractExtension(safeOriginalName);
            String storedName = UUID.randomUUID().toString().replace("-", "") + extension;
            Path storedPath = uploadDir.resolve(storedName);

            try {
                Files.copy(file.getInputStream(), storedPath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new BizException(ErrorCode.INTERNAL_ERROR, "Failed to store file: " + safeOriginalName);
            }

            String relativePath = targetFolder + "/" + storedName;
            results.add(new AssetUploadResponse(
                    safeOriginalName,
                    "/uploads/" + relativePath,
                    relativePath,
                    file.getSize()
            ));
        }

        if (results.isEmpty()) {
            throw new BizException(ErrorCode.BAD_REQUEST, "No valid files uploaded");
        }

        return results;
    }

    public void writePostMarkdown(String postId, String markdownContent) {
        Path markdownDir = buildPostMarkdownDirectory();
        ensureDirectory(markdownDir);

        Path markdownFile = markdownDir.resolve(sanitizeFilename(postId) + ".md");
        try {
            Files.writeString(markdownFile, markdownContent == null ? "" : markdownContent, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new BizException(ErrorCode.INTERNAL_ERROR, "Failed to persist post markdown file");
        }
    }

    public void deletePostMarkdown(String postId) {
        Path markdownFile = buildPostMarkdownDirectory().resolve(sanitizeFilename(postId) + ".md");
        try {
            Files.deleteIfExists(markdownFile);
        } catch (IOException e) {
            throw new BizException(ErrorCode.INTERNAL_ERROR, "Failed to delete post markdown file");
        }
    }

    private Path buildUploadDirectory(String relativeFolder) {
        return Path.of(storageProperties.getRootPath(), storageProperties.getUploadSubDir(), relativeFolder).toAbsolutePath().normalize();
    }

    private Path buildPostMarkdownDirectory() {
        return Path.of(storageProperties.getRootPath(), storageProperties.getPostMarkdownDir()).toAbsolutePath().normalize();
    }

    private void ensureDirectory(Path path) {
        try {
            Files.createDirectories(path);
        } catch (IOException e) {
            throw new BizException(ErrorCode.INTERNAL_ERROR, "Failed to create storage directory");
        }
    }

    private String sanitizeFolder(String folder) {
        return folder.trim().replace("\\", "/")
                .replaceAll("\\.\\.", "")
                .replaceAll("[^a-zA-Z0-9/_-]", "")
                .replaceAll("/+", "/")
                .replaceAll("^/+", "")
                .replaceAll("/+$", "");
    }

    private String sanitizeFilename(String filename) {
        if (!StringUtils.hasText(filename)) {
            return "file";
        }
        return filename.trim().replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String extractExtension(String filename) {
        int index = filename.lastIndexOf('.');
        if (index < 0 || index == filename.length() - 1) {
            return "";
        }

        String ext = filename.substring(index).toLowerCase(Locale.ROOT);
        if (!ext.matches("\\.[a-z0-9]{1,8}")) {
            return "";
        }
        return ext;
    }
}


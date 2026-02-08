package com.liquidthoughts.blog;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiIntegrationTests {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    void shouldLoginAndCreatePostSuccessfully() {
        ResponseEntity<Map> loginResponse = testRestTemplate.postForEntity(
                "/api/auth/login",
                Map.of("username", "admin", "password", "admin"),
                Map.class
        );

        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
        Map<String, Object> loginBody = loginResponse.getBody();
        assertNotNull(loginBody);
        assertEquals(0, ((Number) loginBody.get("code")).intValue());

        Map<String, Object> loginData = (Map<String, Object>) loginBody.get("data");
        assertNotNull(loginData);
        String token = (String) loginData.get("token");
        assertNotNull(token);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> postRequest = Map.of(
                "title", "integration post",
                "content", "integration content",
                "summary", "integration summary",
                "status", "draft",
                "category_id", 1
        );

        ResponseEntity<Map> saveResponse = testRestTemplate.postForEntity(
                "/api/posts",
                new HttpEntity<>(postRequest, headers),
                Map.class
        );

        assertEquals(HttpStatus.OK, saveResponse.getStatusCode());
        Map<String, Object> saveBody = saveResponse.getBody();
        assertNotNull(saveBody);
        assertEquals(0, ((Number) saveBody.get("code")).intValue());
    }

    @Test
    void shouldQueryPagedPosts() {
        ResponseEntity<Map> response = testRestTemplate.getForEntity("/api/posts/page?page=1&page_size=2", Map.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(0, ((Number) body.get("code")).intValue());

        Map<String, Object> pageData = (Map<String, Object>) body.get("data");
        assertNotNull(pageData);
        assertNotNull(pageData.get("records"));
        assertFalse(((java.util.List<?>) pageData.get("records")).isEmpty());
    }
}

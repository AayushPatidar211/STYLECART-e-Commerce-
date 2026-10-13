package com.stylecart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * StyleCart - Fashion E-Commerce Platform
 * Production-ready Spring Boot 3 Full-Stack Application
 */
@SpringBootApplication
@EnableJpaAuditing
public class StyleCartApplication {

    public static void main(String[] args) {
        SpringApplication.run(StyleCartApplication.class, args);
    }
}

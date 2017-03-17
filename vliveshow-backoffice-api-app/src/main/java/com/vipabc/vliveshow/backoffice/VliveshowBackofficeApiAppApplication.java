package com.vipabc.vliveshow.backoffice;

import java.util.Arrays;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@MapperScan("com.vipabc.vliveshow.backoffice.mappers")
public class VliveshowBackofficeApiAppApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(VliveshowBackofficeApiAppApplication.class, args);

//        System.out.println("Let's inspect the beans provided by Spring Boot:");
//
//        String[] beanNames = ctx.getBeanDefinitionNames();
//        Arrays.sort(beanNames);
//        for (String beanName : beanNames) {
//            System.out.println(beanName);
//        }
    }

    // if want to register a redis template with specific key & value, use following code.
//    @Bean
//    RedisTemplate<String, UserSession> redisTemplateUserSession(RedisConnectionFactory redisConnectionFactory) {
//        RedisTemplate<String, UserSession> template = new RedisTemplate<String, UserSession>();
//        template.setConnectionFactory(redisConnectionFactory);
//
//        Jackson2JsonRedisSerializer<UserSession> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<UserSession>(
//                UserSession.class);
//        template.setValueSerializer(jackson2JsonRedisSerializer);
//        template.setKeySerializer(new StringRedisSerializer());
//
//        return template;
//    }
}

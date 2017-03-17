package com.vipabc.vliveshow.backoffice.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.vipabc.vliveshow.backoffice.services.TokenBasedService;
import com.vipabc.vliveshow.backoffice.services.impl.TokenBasedServiceImpl;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

//    @Autowired
//    DataSource dataSource;
    
    @Bean
    public TokenBasedService tokenBasedService() {
        return new TokenBasedServiceImpl();
    }
    
    @Bean
    public AuthenticationProvider tokenAuthenticationProvider() {
        return new TokenAuthenticationProvider(tokenBasedService());
    }
    
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
        // Spring Security should completely ignore URLs starting with /resources/
                .antMatchers("**.html", "/assets/**");
    }
 
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        
        //http.exceptionHandling()
        
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers("/api/v1/accounts/login").permitAll()
            .antMatchers("/api/**").authenticated();
            
//        .and()
//            //.anonymous().disable()
//            //.exceptionHandling().authenticationEntryPoint(unauthorizedEntryPoint())
//            //.and()
//            // Possibly more configuration ...
//            .formLogin().loginPage("/") // enable form based log in
//            // set permitAll for all URLs associated with Form Login
//            .permitAll();
        
        http.addFilterBefore(new TokenAuthenticationFilter(authenticationManager()), BasicAuthenticationFilter.class);

    }
 
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(tokenAuthenticationProvider());
    }

}

// package com.fajarcodes.learn.Spring.with.React.service;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import
// org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import com.fajarcodes.learn.Spring.with.React.model.AppUserDetail;
// import com.fajarcodes.learn.Spring.with.React.model.User;
// import com.fajarcodes.learn.Spring.with.React.repositories.UserRepositories;

// import lombok.AllArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Service
// @AllArgsConstructor
// @Slf4j
// public class AppUserDetailService implements UserDetailsService {
// private UserRepositories userRepositories;

// public UserDetails loadUserByUsername(String username) throws
// UsernameNotFoundException {
// User user = userRepositories
// .findByUsername(username)
// .orElseThrow(() -> new UsernameNotFoundException("username is not found"));

// return new AppUserDetail(user);
// }
// }

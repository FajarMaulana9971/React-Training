package com.fajarcodes.learn.Spring.with.React.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fajarcodes.learn.Spring.with.React.model.Role;

@Repository
public interface RoleRepositories extends JpaRepository<Role, Integer> {
    Role findByName(String name);
}

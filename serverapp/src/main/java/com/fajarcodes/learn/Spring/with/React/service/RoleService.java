package com.fajarcodes.learn.Spring.with.React.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.fajarcodes.learn.Spring.with.React.model.Role;
import com.fajarcodes.learn.Spring.with.React.repositories.RoleRepositories;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RoleService {
    private RoleRepositories roleRepositories;

    public List<Role> getAll() {
        return roleRepositories.findAll();
    }

    public Role getById(Integer id) {
        return roleRepositories.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "role id is not found"));
    }

    public Role create(Role roles) {
        return roleRepositories.save(roles);
    }

    public Role update(Integer id, Role roles) {
        getById(id);
        roles.setId(id);
        return roleRepositories.save(roles);
    }

    public Role delete(Integer id) {
        Role role = getById(id);
        roleRepositories.delete(role);
        return role;
    }
}

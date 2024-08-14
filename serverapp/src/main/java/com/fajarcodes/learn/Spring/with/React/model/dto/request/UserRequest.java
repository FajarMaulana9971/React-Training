package com.fajarcodes.learn.Spring.with.React.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class UserRequest {
    private Integer id;
    private String username;
    private String password;
}

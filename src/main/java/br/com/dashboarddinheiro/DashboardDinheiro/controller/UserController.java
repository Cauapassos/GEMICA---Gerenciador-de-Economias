package br.com.dashboarddinheiro.DashboardDinheiro.controller;

import br.com.dashboarddinheiro.DashboardDinheiro.model.User;
import br.com.dashboarddinheiro.DashboardDinheiro.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping
    ResponseEntity<List<User>> listarTodos(){
        List<User> user = userService.buscarTodos();
        return ResponseEntity.ok(user);
    }
}

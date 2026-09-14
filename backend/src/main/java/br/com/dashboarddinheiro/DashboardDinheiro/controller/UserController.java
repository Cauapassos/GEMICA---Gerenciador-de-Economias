package br.com.dashboarddinheiro.DashboardDinheiro.controller;

import br.com.dashboarddinheiro.DashboardDinheiro.model.User;
import br.com.dashboarddinheiro.DashboardDinheiro.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/get")
    ResponseEntity<List<User>> listarTodos(){
        List<User> user = userService.buscarTodos();
        return ResponseEntity.ok(user);
    }
    @PostMapping("/post")
    ResponseEntity<User> criar(@RequestBody User user){
        User usuarioSalvo = userService.salvar(user);

        return ResponseEntity.ok(usuarioSalvo);
    }

    @PutMapping("/put/{id}")
    ResponseEntity<User> atualizar(@PathVariable Long id, @RequestBody User user){
        User usuarioAtualizado = userService.atualizar(id, user);
        return ResponseEntity.ok(usuarioAtualizado);
    }
}

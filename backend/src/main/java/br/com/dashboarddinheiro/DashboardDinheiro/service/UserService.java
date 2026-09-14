package br.com.dashboarddinheiro.DashboardDinheiro.service;

import br.com.dashboarddinheiro.DashboardDinheiro.model.User;
import br.com.dashboarddinheiro.DashboardDinheiro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public List<User> buscarTodos(){
        return userRepository.findAll();
    }

    public User salvar(User user){
        return userRepository.save(user);
    }

    public User atualizar(Long id, User dadosNovos){
        User usuario = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario nao encotrnado"));
        userRepository.findById(id);
        usuario.setEmail(usuario.getEmail());
        usuario.setSaldo(usuario.getSaldo());
        return userRepository.save(usuario);
    }

}

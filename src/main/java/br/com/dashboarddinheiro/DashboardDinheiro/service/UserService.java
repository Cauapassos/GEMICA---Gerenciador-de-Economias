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


}

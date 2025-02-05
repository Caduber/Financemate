package com.example.financemate;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouteController {
    
    @GetMapping("/")
    public String getHome() {
        return "index";
    }
    
    @GetMapping("/usuario")
    public String getMethodName() {
        return "usuario";
    }
    
}

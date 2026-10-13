package com.stylecart.service;

import com.stylecart.dto.AuthResponse;
import com.stylecart.dto.LoginRequest;
import com.stylecart.dto.RegisterRequest;
import com.stylecart.entity.Cart;
import com.stylecart.entity.Role;
import com.stylecart.entity.User;
import com.stylecart.entity.Wishlist;
import com.stylecart.exception.BadRequestException;
import com.stylecart.repository.CartRepository;
import com.stylecart.repository.UserRepository;
import com.stylecart.repository.WishlistRepository;
import com.stylecart.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtService.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_USER;

        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );
        user.setPhoneNumber(request.getPhoneNumber());

        User savedUser = userRepository.save(user);

        // Initialize empty Cart and Wishlist for user
        Cart cart = new Cart(savedUser);
        cartRepository.save(cart);

        Wishlist wishlist = new Wishlist(savedUser);
        wishlistRepository.save(wishlist);

        String jwt = jwtService.generateTokenFromUsername(
                savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name()
        );

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole()
        );
    }
}

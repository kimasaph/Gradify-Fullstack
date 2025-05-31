package com.capstone.gradify.Repository.user;

import com.capstone.gradify.Entity.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.capstone.gradify.Entity.user.UserEntity;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>{
  UserEntity findByEmail(String email);
  List<UserEntity> findByRole(String role);

}
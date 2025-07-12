package com.pro.doctormanagementservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DoctorManagementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoctorManagementServiceApplication.class, args);
	}

}

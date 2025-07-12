package com.pro.pharmacymanagementservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PharmacyManagementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PharmacyManagementServiceApplication.class, args);
	}

}

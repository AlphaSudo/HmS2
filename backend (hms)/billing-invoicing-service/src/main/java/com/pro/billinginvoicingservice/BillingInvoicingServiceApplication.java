package com.pro.billinginvoicingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class BillingInvoicingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BillingInvoicingServiceApplication.class, args);
	}

}

package com.pro.patientmanagementservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class MobileAlreadyExistsException extends RuntimeException {
    public MobileAlreadyExistsException(String message) {
        super(message);
    }
} 
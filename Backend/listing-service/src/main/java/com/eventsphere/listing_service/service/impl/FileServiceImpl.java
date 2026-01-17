package com.eventsphere.listing_service.service.impl;


import com.cloudinary.Cloudinary;
import com.eventsphere.listing_service.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of(
                        "folder", "event-sphere/listings"
//                        ,
//                        "resource_type", "image"
                )
        );

        // Return Cloudinary image URL
        return uploadResult.get("secure_url").toString();
    }
}

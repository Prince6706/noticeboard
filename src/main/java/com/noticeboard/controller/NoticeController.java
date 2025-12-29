package com.noticeboard.controller;

import com.noticeboard.model.Notice;
import com.noticeboard.service.NoticeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notices")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // POST /notices - Create a new notice
    @PostMapping
    public ResponseEntity<Notice> createNotice(@Valid @RequestBody Notice notice) {
        Notice createdNotice = noticeService.createNotice(notice);
        return new ResponseEntity<>(createdNotice, HttpStatus.CREATED);
    }

    // GET /notices - Get all notices
    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        List<Notice> notices = noticeService.getAllNotices();
        return new ResponseEntity<>(notices, HttpStatus.OK);
    }

    // GET /notices/{id} - Get notice by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable Long id) {
        return noticeService.getNoticeById(id)
                .map(notice -> new ResponseEntity<>(notice, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // PUT /notices/{id} - Update an existing notice
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id,
            @Valid @RequestBody Notice noticeDetails) {
        try {
            Notice updatedNotice = noticeService.updateNotice(id, noticeDetails);
            return new ResponseEntity<>(updatedNotice, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE /notices/{id} - Delete a notice
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        try {
            noticeService.deleteNotice(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

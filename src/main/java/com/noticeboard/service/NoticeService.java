package com.noticeboard.service;

import com.noticeboard.model.Notice;
import com.noticeboard.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    // Create a new notice
    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    // Get all notices
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    // Get notice by ID
    public Optional<Notice> getNoticeById(Long id) {
        return noticeRepository.findById(id);
    }

    // Update an existing notice
    public Notice updateNotice(Long id, Notice noticeDetails) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with id: " + id));

        notice.setTitle(noticeDetails.getTitle());
        notice.setDescription(noticeDetails.getDescription());

        return noticeRepository.save(notice);
    }

    // Delete a notice
    public void deleteNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with id: " + id));

        noticeRepository.delete(notice);
    }
}

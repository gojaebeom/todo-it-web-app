package kr.todoit.api.domain;

import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Table(name="todos")
@Entity
@NoArgsConstructor
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "calendar_id")
    private Calendar calendar;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name="is_finished", columnDefinition = "tinyint default 0")
    private Byte isFinished;

    @Column(name = "matched_date")
    private String matchedDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Builder
    public Todo(Long id, User user, Calendar calendar, String title, String description, Byte isFinished, String matchedDate) {
        this.id = id;
        this.user = user;
        this.calendar = calendar;
        this.title = title;
        this.description = description;
        this.isFinished = isFinished;
        this.matchedDate = matchedDate;
    }
}


;; Pollbag - A decentralized poll pool contract
;; Users can create polls, vote with STX, and claim rewards

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-POLL-NOT-FOUND (err u101))
(define-constant ERR-POLL-ENDED (err u102))
(define-constant ERR-POLL-ACTIVE (err u103))
(define-constant ERR-ALREADY-VOTED (err u104))
(define-constant ERR-INVALID-OPTION (err u105))
(define-constant ERR-INSUFFICIENT-FUNDS (err u106))
(define-constant ERR-NO-REWARD (err u107))
(define-constant ERR-ALREADY-CLAIMED (err u108))

;; Data structures
(define-map polls
  { poll-id: uint }
  {
    creator: principal,
    question: (string-utf8 256),
    vote-fee: uint,
    reward-pool: uint,
    end-block: uint,
    total-votes: uint,
    options-count: uint,
    is-active: bool
  }
)

(define-map poll-options
  { poll-id: uint, option-id: uint }
  { text: (string-utf8 100), votes: uint }
)

(define-map votes
  { poll-id: uint, voter: principal }
  { option-id: uint }
)

(define-map reward-claims
  { poll-id: uint, voter: principal }
  { claimed: bool }
)

;; Data variables
(define-data-var poll-counter uint u0)

;; Read-only functions
(define-read-only (get-poll (poll-id uint))
  (map-get? polls { poll-id: poll-id })
)

(define-read-only (get-option (poll-id uint) (option-id uint))
  (map-get? poll-options { poll-id: poll-id, option-id: option-id })
)

(define-read-only (get-vote (poll-id uint) (voter principal))
  (map-get? votes { poll-id: poll-id, voter: voter })
)

(define-read-only (has-claimed (poll-id uint) (voter principal))
  (default-to false (get claimed (map-get? reward-claims { poll-id: poll-id, voter: voter })))
)

(define-read-only (get-poll-count)
  (var-get poll-counter)
)

;; Public functions

;; Create a new poll
(define-public (create-poll
  (question (string-utf8 256))
  (options (list 6 (string-utf8 100)))
  (vote-fee uint)
  (duration-blocks uint)
  (reward-amount uint)
)
  (let
    (
      (poll-id (+ (var-get poll-counter) u1))
      (end-block (+ block-height duration-blocks))
      (options-count (len options))
    )
    ;; Transfer reward amount if provided
    (if (> reward-amount u0)
      (try! (stx-transfer? reward-amount tx-sender (as-contract tx-sender)))
      true
    )
    
    ;; Create poll
    (map-set polls
      { poll-id: poll-id }
      {
        creator: tx-sender,
        question: question,
        vote-fee: vote-fee,
        reward-pool: reward-amount,
        end-block: end-block,
        total-votes: u0,
        options-count: options-count,
        is-active: true
      }
    )
    
    ;; Store options (simplified - would need fold in production)
    (map-set poll-options { poll-id: poll-id, option-id: u0 } { text: (unwrap! (element-at? options u0) ERR-INVALID-OPTION), votes: u0 })
    (if (>= options-count u2)
      (map-set poll-options { poll-id: poll-id, option-id: u1 } { text: (unwrap! (element-at? options u1) ERR-INVALID-OPTION), votes: u0 })
      true
    )
    (if (>= options-count u3)
      (map-set poll-options { poll-id: poll-id, option-id: u2 } { text: (unwrap! (element-at? options u2) ERR-INVALID-OPTION), votes: u0 })
      true
    )
    (if (>= options-count u4)
      (map-set poll-options { poll-id: poll-id, option-id: u3 } { text: (unwrap! (element-at? options u3) ERR-INVALID-OPTION), votes: u0 })
      true
    )
    
    (var-set poll-counter poll-id)
    (ok poll-id)
  )
)

;; Vote on a poll
(define-public (vote (poll-id uint) (option-id uint))
  (let
    (
      (poll (unwrap! (get-poll poll-id) ERR-POLL-NOT-FOUND))
      (option (unwrap! (get-option poll-id option-id) ERR-INVALID-OPTION))
      (vote-fee (get vote-fee poll))
    )
    ;; Check poll is active
    (asserts! (get is-active poll) ERR-POLL-ENDED)
    (asserts! (< block-height (get end-block poll)) ERR-POLL-ENDED)
    
    ;; Check not already voted
    (asserts! (is-none (get-vote poll-id tx-sender)) ERR-ALREADY-VOTED)
    
    ;; Transfer vote fee to contract
    (try! (stx-transfer? vote-fee tx-sender (as-contract tx-sender)))
    
    ;; Record vote
    (map-set votes { poll-id: poll-id, voter: tx-sender } { option-id: option-id })
    
    ;; Update option votes
    (map-set poll-options
      { poll-id: poll-id, option-id: option-id }
      { text: (get text option), votes: (+ (get votes option) u1) }
    )
    
    ;; Update poll total votes and add fee to reward pool
    (map-set polls
      { poll-id: poll-id }
      (merge poll {
        total-votes: (+ (get total-votes poll) u1),
        reward-pool: (+ (get reward-pool poll) vote-fee)
      })
    )
    
    (ok true)
  )
)

;; End a poll (can be called by anyone after end block)
(define-public (end-poll (poll-id uint))
  (let
    (
      (poll (unwrap! (get-poll poll-id) ERR-POLL-NOT-FOUND))
    )
    ;; Check poll is still active
    (asserts! (get is-active poll) ERR-POLL-ENDED)
    ;; Check end block has passed
    (asserts! (>= block-height (get end-block poll)) ERR-POLL-ACTIVE)
    
    ;; Mark poll as ended
    (map-set polls
      { poll-id: poll-id }
      (merge poll { is-active: false })
    )
    
    (ok true)
  )
)

;; Claim reward
(define-public (claim-reward (poll-id uint))
  (let
    (
      (poll (unwrap! (get-poll poll-id) ERR-POLL-NOT-FOUND))
      (vote-record (unwrap! (get-vote poll-id tx-sender) ERR-NO-REWARD))
      (total-votes (get total-votes poll))
      (reward-pool (get reward-pool poll))
      (share (/ reward-pool total-votes))
    )
    ;; Check poll has ended
    (asserts! (not (get is-active poll)) ERR-POLL-ACTIVE)
    
    ;; Check not already claimed
    (asserts! (not (has-claimed poll-id tx-sender)) ERR-ALREADY-CLAIMED)
    
    ;; Check there's a reward to claim
    (asserts! (> share u0) ERR-NO-REWARD)
    
    ;; Mark as claimed
    (map-set reward-claims { poll-id: poll-id, voter: tx-sender } { claimed: true })
    
    ;; Transfer reward
    (try! (as-contract (stx-transfer? share tx-sender tx-sender)))
    
    (ok share)
  )
)

-- Add 4 more users to tc0 challenge from Gobundance Elite & Champions
DO $$ 
DECLARE
    v_community_id uuid;
    v_user_record record;
    v_start_date timestamptz;
BEGIN
    -- Get Gobundance Elite & Champions community ID
    SELECT id INTO v_community_id
    FROM communities
    WHERE name = 'Gobundance Elite & Champion';

    -- Set consistent start date for all users
    v_start_date := now() - interval '3 days';

    -- Add tc0 challenge for each eligible user
    FOR v_user_record IN (
        SELECT u.id, u.name
        FROM users u
        JOIN community_memberships cm ON cm.user_id = u.id
        WHERE cm.community_id = v_community_id
        AND cm.is_primary = true
        AND u.email LIKE 'gb_test_%@healthrocket.test'
        AND NOT EXISTS (
            SELECT 1 FROM challenges c
            WHERE c.user_id = u.id
            AND c.challenge_id = 'tc0'
        )
        LIMIT 4
    ) LOOP
        -- Add tc0 challenge
        INSERT INTO challenges (
            user_id,
            challenge_id,
            status,
            progress,
            started_at,
            verifications_required,
            verification_count
        ) VALUES (
            v_user_record.id,
            'tc0',
            'active',
            0,
            v_start_date,
            3,
            0
        );

        RAISE NOTICE 'Added tc0 challenge for user: %', v_user_record.name;
    END LOOP;
END $$;
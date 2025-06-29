-- Function to get dashboard summary
CREATE OR REPLACE FUNCTION get_dashboard_summary(user_uuid UUID)
RETURNS TABLE(total_contracts BIGINT, active_contracts BIGINT, pending_contracts BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM contracts WHERE user_id = user_uuid) AS total_contracts,
        (SELECT COUNT(*) FROM contracts WHERE user_id = user_uuid AND status = 'Active') AS active_contracts,
        (SELECT COUNT(*) FROM contracts WHERE user_id = user_uuid AND status = 'Pending Review') AS pending_contracts;
END;
$$;

-- Function to get contract trends (e.g., new contracts per month)
-- This is a simplified example. A real trend function would involve date truncations and grouping.
CREATE OR REPLACE FUNCTION get_contract_trends(user_uuid UUID, months_back INT DEFAULT 6)
RETURNS TABLE(month TEXT, new_contracts BIGINT, completed_contracts BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        TO_CHAR(date_trunc('month', generate_series(NOW() - INTERVAL '1 month' * (months_back - 1), NOW(), INTERVAL '1 month')), 'YYYY-MM') AS month,
        (SELECT COUNT(*) FROM contracts WHERE user_id = user_uuid AND date_trunc('month', created_at) = date_trunc('month', generate_series)) AS new_contracts,
        (SELECT COUNT(*) FROM contracts WHERE user_id = user_uuid AND date_trunc('month', updated_at) = date_trunc('month', generate_series) AND status = 'Completed') AS completed_contracts
    FROM generate_series(NOW() - INTERVAL '1 month' * (months_back - 1), NOW(), INTERVAL '1 month')
    GROUP BY month
    ORDER BY month;
END;
$$;

-- Function to get contract status distribution
CREATE OR REPLACE FUNCTION get_contract_status_distribution(user_uuid UUID)
RETURNS TABLE(status TEXT, count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.status,
        COUNT(c.id) AS count
    FROM
        contracts c
    WHERE
        c.user_id = user_uuid
    GROUP BY
        c.status
    ORDER BY
        count DESC;
END;
$$;

-- Function to get audit logs for a user
CREATE OR REPLACE FUNCTION get_user_audit_logs(user_uuid UUID, limit_count INT DEFAULT 10)
RETURNS TABLE(id UUID, timestamp TIMESTAMP WITH TIME ZONE, user_email TEXT, action TEXT, target TEXT, details JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.id,
        al.timestamp,
        al.user_email,
        al.action,
        al.target,
        al.details
    FROM
        audit_logs al
    WHERE
        al.user_id = user_uuid -- Assuming audit_logs table has a user_id column
    ORDER BY
        al.timestamp DESC
    LIMIT limit_count;
END;
$$;

-- Function to get pending reviews for a user (e.g., contracts needing approval)
CREATE OR REPLACE FUNCTION get_pending_reviews(user_uuid UUID, limit_count INT DEFAULT 5)
RETURNS TABLE(id UUID, title TEXT, description TEXT, created_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.contract_name AS title,
        'Contract needs your review.' AS description,
        c.created_at
    FROM
        contracts c
    WHERE
        c.user_id = user_uuid AND c.status = 'Pending Review'
    ORDER BY
        c.created_at ASC
    LIMIT limit_count;
END;
$$;

-- Function to get admin actions (mock data for now)
CREATE OR REPLACE FUNCTION get_admin_actions()
RETURNS TABLE(id TEXT, name TEXT, description TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY VALUES
    ('1', 'Run Database Migration', 'Apply latest schema changes.'),
    ('2', 'Clear Application Cache', 'Clear cached data for all users.'),
    ('3', 'Generate System Report', 'Generate a comprehensive system health report.');
END;
$$;

-- Function to get notifications for a user
CREATE OR REPLACE FUNCTION get_user_notifications(user_uuid UUID, limit_count INT DEFAULT 10)
RETURNS TABLE(id UUID, type TEXT, message TEXT, created_at TIMESTAMP WITH TIME ZONE, is_read BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.id,
        n.type,
        n.message,
        n.created_at,
        n.is_read
    FROM
        notifications n
    WHERE
        n.user_id = user_uuid
    ORDER BY
        n.created_at DESC
    LIMIT limit_count;
END;
$$;

-- Function to get dashboard analytics
CREATE OR REPLACE FUNCTION get_dashboard_analytics()
RETURNS TABLE(
    total_contracts BIGINT,
    active_contracts BIGINT,
    pending_review_contracts BIGINT,
    total_parties BIGINT,
    total_promoters BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM contracts) AS total_contracts,
        (SELECT COUNT(*) FROM contracts WHERE status = 'Active') AS active_contracts,
        (SELECT COUNT(*) FROM contracts WHERE status = 'Pending Review') AS pending_review_contracts,
        (SELECT COUNT(*) FROM parties) AS total_parties,
        (SELECT COUNT(*) FROM promoters) AS total_promoters;
END;
$$;

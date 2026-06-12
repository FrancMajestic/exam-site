CREATE OR REPLACE FUNCTION increment_user_stats(user_id_param bigint, coins_param integer)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE users
  SET
    total_tasks_solved = total_tasks_solved + 1,
    correct_answers = correct_answers + 1,
    coin_balance = coin_balance + coins_param,
    total_earned = total_earned + coins_param
  WHERE id = user_id_param;
END;
$$;
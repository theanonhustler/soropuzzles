#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

#[contract]
pub struct WordRandomPuzzle;

#[contractimpl]
impl WordRandomPuzzle {
    pub fn play(env: Env, prediction: Symbol) -> Vec<Symbol> {
        let random_number = env.prng().gen_range(2..=12);
        let outcome = match random_number {
            1..=6 => symbol_short!("present"),
            7 => symbol_short!("absent"),
            _ => symbol_short!("correct"),
        };

        let is_prediction_correct = outcome.eq(&prediction);
        let result_symbol = Self::number_to_symbol(&env, random_number);

        // Generate the output vector
        let win_or_lose = if is_prediction_correct {
            symbol_short!("won")
        } else {
            symbol_short!("next")
        };

        vec![
            &env,
            win_or_lose,
            prediction,
            result_symbol,
        ]
    }

    fn number_to_symbol(env: &Env, number: u64) -> Symbol {
        // Map numbers to symbols
        match number {
            2 => Symbol::new(env, "2"),
            3 => Symbol::new(env, "3"),
            4 => Symbol::new(env, "4"),
            5 => Symbol::new(env, "5"),
            6 => Symbol::new(env, "6"),
            7 => Symbol::new(env, "7"),
            8 => Symbol::new(env, "8"),
            9 => Symbol::new(env, "9"),
            10 => Symbol::new(env, "10"),
            11 => Symbol::new(env, "11"),
            12 => Symbol::new(env, "12"),
            _ => Symbol::new(env, "Invalid"),
        }
    }
}

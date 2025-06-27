import random

def randomize_word_list(input_file, output_file):
    # Read words from the input file
    with open(input_file, 'r') as f:
        words = f.read().splitlines()

    # Shuffle the list
    random.shuffle(words)

    # Write the randomized list to the output file
    with open(output_file, 'w') as f:
        for word in words:
            f.write(word + '\n')

    print(f"Randomized word list written to {output_file}")

randomize_word_list('./word-bank-answers.txt', 'new-file.txt')

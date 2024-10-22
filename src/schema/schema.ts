type User = {
  id: string;
  username: string;
  password: string;
  gameStats: {
    coins: number;
    hints: number;
    completedPercentage: number;
  };
  profile: {
    decorations: string[];
    selectedDecoration: string;
  };
};

type WordType = 'easy' | 'medium' | 'hard';

type WordSet = {
  id: string;
  type: WordType;
  words: string[];
};

type GameHistory = {
  id: string;
  userId: string;
  info: {
    [key in WordType]: {
      words: string[];
      currentWord: string;
      completed: boolean;
    };
  };
  duration: number;
};

type ProfileDecoration = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

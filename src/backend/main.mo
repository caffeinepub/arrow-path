import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  module Progress {
    public func compare(p1 : Progress, p2 : Progress) : Order.Order {
      Text.compare(p1.levelId, p2.levelId);
    };
  };

  type Progress = {
    levelId : Text;
    bestMoveCount : Nat;
  };

  let progressMap = Map.empty<Text, Nat>();

  var highestLevelReached = 0;

  public shared ({ caller }) func markLevelCompleted(levelId : Text, moveCount : Nat) : async () {
    switch (progressMap.get(levelId)) {
      case (null) {
        progressMap.add(levelId, moveCount);
        highestLevelReached += 1;
      };
      case (?bestSoFar) {
        if (moveCount < bestSoFar) {
          progressMap.add(levelId, moveCount);
        };
      };
    };
  };

  public query ({ caller }) func getHighestLevelReached() : async Nat {
    highestLevelReached;
  };

  public query ({ caller }) func getBestMoveCount(levelId : Text) : async ?Nat {
    progressMap.get(levelId);
  };

  public query ({ caller }) func getAllProgress() : async [Progress] {
    progressMap.toArray().map(
      func(pair) {
        {
          levelId = pair.0;
          bestMoveCount = pair.1;
        };
      }
    ).sort();
  };

  public shared ({ caller }) func resetProgress() : async () {
    progressMap.clear();
    highestLevelReached := 0;
  };
};

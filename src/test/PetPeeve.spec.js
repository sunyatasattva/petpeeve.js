import PetPeeve, { Operations as _ } from "../index";

describe("Autocorrect utilities", () => {
  describe("Capitalize sentences", () => {
    test("It should capitalize at the start of a string", () => {
      const wrong = "beginning capitalization";
      const correct = "Beginning capitalization";

      expect( _.capitalizeSentences(wrong) )
        .toEqual(correct);
    });

    test("It should capitalize after punctuation", () => {
      const wrong = "Capitalization after period. after exclamation marks! and also after questions?yes.";
      const correct = "Capitalization after period. After exclamation marks! And also after questions?Yes.";

      expect( _.capitalizeSentences(wrong) )
        .toEqual(correct);
    });

    test("It should capitalize after newlines", () => {
      const wrong = "Multiline sentence\n capitalization";
      const correct = "Multiline sentence\n Capitalization";

      expect( _.capitalizeSentences(wrong) )
        .toEqual(correct);
    });

    test("It should capitalize after newlines when containing non-word characters", () => {
      const wrong = "Multiline sentence\n # capitalization";
      const correct = "Multiline sentence\n # Capitalization";

      expect( _.capitalizeSentences(wrong) )
        .toEqual(correct);
    });
  });

  describe("Fix ending punctuation", () => {
    it("Should add a period at the end of a line", () => {
      const wrong = "New line\nwithout space\n with space\n“with quotes”";
      const correct = "New line.\nwithout space.\n with space.\n“with quotes”.";

      expect( _.fixEndingPunctuation(wrong) )
        .toEqual(correct);
    });

    it("Should transform quotation marks into double carets if sentence begins and ends with them", () => {
      const wrong = "\"Hey man!\"";
      const correct = "«Hey man!»";
      const neutral = "Here is a \"sentence\" which should not be touched.";

      expect( _.fixEndingPunctuation(wrong) )
        .toEqual(correct);

      expect( _.fixEndingPunctuation(neutral) )
        .toEqual(neutral);
    });

    const correctSentences = [
      ["period", "A sentence!\nCorrect punctuation."],
      ["exclamation mark", "It ends with a bang!"],
      ["question mark", "Isn't it funny?"],
      ["double carets", "«It's very funny»"]
    ];

    test.each(correctSentences)(
      "Should not add a period if the sentence ends with a punctuation (%p)",
      (type, value) => {
        expect( _.fixEndingPunctuation(value) )
          .toEqual(value);
      }
    );
  });

  describe("Fix punctuation space", () => {
    const spaceAfter = test.each`
      mark            | wrong              | correct
      ${"comma"}      | ${"a comma,word"}  | ${"a comma, word"}
      ${"period"}     | ${"period.word"}   | ${"period. word"}
      ${"colon"}      | ${"colon:word"}    | ${"colon: word"}
      ${"semicolon"}  | ${"colon;word"}    | ${"colon; word"}
      ${"c-bracket"}  | ${"mark)word"}     | ${"mark) word"}
      ${"bang"}       | ${"bang!word"}     | ${"bang! word"}
      ${"question"}   | ${"question?word"} | ${"question? word"}
      ${"c-quote"}    | ${"quote”word"}    | ${"quote” word"}
      ${"c-carets"}   | ${"quote»word"}    | ${"quote» word"}
      ${"ellipsis"}   | ${"quote…word"}    | ${"quote… word"}
    `;

    spaceAfter(
      "Should add a space after a $mark",
      ({ correct, wrong }) => {
        expect( _.fixPunctuationSpace(wrong) )
          .toEqual(correct);
      });

    const noSpaceAfter = test.each`
      mark         | wrong        | correct
      ${"o-quote"} | ${"“ quote"} | ${"“quote"}
      ${"o-caret"} | ${"« quote"} | ${"«quote"}
    `;

    noSpaceAfter(
      "Should remove spaces after a $mark",
      ({ correct, wrong }) => {
        expect( _.fixPunctuationSpace(wrong) )
          .toEqual(correct);
      });

    const neutral = test.each`
      mark         | correct
      ${"comma"}   | ${"10,22"}
      ${"colon"}   | ${"10:22"}
      ${"period"}  | ${"10.22"}
    `;

    neutral(
      "Should not touch spaces for punctuation if digits are present ($mark)",
      ({ correct }) => {
        expect( _.fixPunctuationSpace(correct) )
          .toEqual(correct);
      });
  });

  describe("Smart dialog markers", () => {
    it("Should convert an hyphen delimited dialog, to double carets", () => {
      const wrong = `- Question?\n- Answer!`;
      const correct = `«Question?»\n«Answer!»`;

      expect( _.smartDialogMarkers(wrong) )
        .toEqual(correct);
    });
  });

  describe("Smart punctuation", () => {
    const smartPunctuation = test.each`
      from       | to      | wrong            | correct
      ${"\"\""}  | ${"“”"} | ${"\"word\""}    | ${"“word”"}
      ${"<<>>"}  | ${"«»"} | ${"<< word >>"}  | ${"« word »"}
      ${"--"}    | ${"–n"} | ${"word--word"}  | ${"word\u2013word"}
      ${"---"}   | ${"—m"} | ${"word---word"} | ${"word\u2014word"}
      ${"..."}   | ${"…"}  | ${"word...word"} | ${"word…word"}
      ${". . ."} | ${"…"}  | ${"word. . .wo"} | ${"word…wo"}
    `;

    smartPunctuation(
      "Should convert $from to $to",
      ({ correct, wrong }) => {
        expect( _.smartPunctuation(wrong) )
          .toEqual(correct);
      });
  });

  describe("Periods outside brackets", () => {
    const brackets = test.each`
      mark        | wrong          | correct
      ${"round"}  | ${"(period.)"} | ${"(period)."}
      ${"quotes"} | ${"period.”"}  | ${"period”."}
    `;

    brackets(
      "Should move period outside of brackets ($mark)",
      ({ correct, wrong }) => {
        expect( _.periodOutsideBrackets(wrong) )
          .toEqual(correct);
      });
  });

  describe("Remove extra punctuation", () => {
    test("It should remove duplicate punctuation", () => {
      const wrong = "A bunch.. of extra,,,, punctuation!!! cool??? welp……";
      const correct = "A bunch. of extra, punctuation! cool? welp…";

      expect( _.removeExtraPunctuation(wrong) )
        .toEqual(correct);
    });
  });

  describe("Remove extra spaces", () => {
    test("It should remove duplicate spaces, returns and new lines", () => {
      const wrong = "  So  many      spaces\n\nI think  ";
      const correct = "So many spaces\nI think";

      expect( _.removeExtraSpaces(wrong) )
        .toEqual(correct);
    });

    test("It should remove spaces before and after newlines", () => {
      const wrong = "I've got \n a space";
      const correct = "I've got\na space";

      expect( _.removeExtraSpaces(wrong) )
        .toEqual(correct);
    });
  });

  describe("Autocorrect pipe", () => {
    test("It should sanitize a sentence with all the functions in the correct order", () => {
      const wrong = "- sometimes,,typing can be \"hard\"...so--why   not--<<give the user>> some help?? yes"
        + "\n- you're right:we totally should (I think.)";
      const correct = "«Sometimes, typing can be “hard”… so–why not–«give the user» some help? Yes.»"
        + "\n«You're right: we totally should (I think).»";

      expect( PetPeeve()(wrong) )
        .toEqual(correct);
    });

    test("It should sanitize a sentence accepting only operations passed by the user", () => {
      const wrong = "- sometimes,,typing can be \"hard\"...so--why   not--<<give the user>> some help?? yes"
        + "\n- you're right:we totally should (I think.)";
      const correct = "- sometimes,typing can be \"hard\".so--why not--<<give the user>> some help? yes"
      + "\n- you're right:we totally should (I think.)";

      expect( PetPeeve({ removeExtraPunctuation: true, removeExtraSpaces: true })(wrong) )
        .toEqual(correct);
    });

    test("It should allow to initialize the function, but then change the options", () => {
      const corrector = PetPeeve();

      const wrong = "- sometimes,,typing can be \"hard\"...so--why   not--<<give the user>> some help?? yes"
        + "\n- you're right:we totally should (I think.)";
      const limitedCorrect = "- Sometimes, typing can be “hard”… so–why not–«give the user» some help? Yes."
      + "\n- You're right: we totally should (I think).";

      expect( corrector(wrong, { smartDialogMarkers: false }) )
        .toEqual(limitedCorrect);
    });
  });
});

grammar OpenTUIProgram;

program
  : importDecl* exportDefaultDecl EOF
  ;

importDecl
  : 'import' importBody 'from' stringLiteral ';'?
  ;

importBody
  : Identifier
  | '{' identifierList? '}'
  | Identifier ',' '{' identifierList? '}'
  ;

exportDefaultDecl
  : 'export' 'default' 'function' Identifier? '(' ')' block
  ;

block
  : '{' 'return' expression ';'? '}'
  ;

expression
  : callExpression
  | objectLiteral
  | arrayLiteral
  | stringLiteral
  | numberLiteral
  | booleanLiteral
  | Identifier
  ;

callExpression
  : Identifier '(' argumentList? ')'
  ;

argumentList
  : expression (',' expression)* ','?
  ;

objectLiteral
  : '{' propertyList? '}'
  ;

propertyList
  : property (',' property)* ','?
  ;

property
  : Identifier ':' expression
  ;

arrayLiteral
  : '[' expressionList? ']'
  ;

expressionList
  : expression (',' expression)* ','?
  ;

identifierList
  : Identifier (',' Identifier)* ','?
  ;

stringLiteral
  : StringLiteral
  ;

numberLiteral
  : NumberLiteral
  ;

booleanLiteral
  : 'true'
  | 'false'
  ;

Identifier
  : [a-zA-Z_$] [a-zA-Z0-9_$]*
  ;

StringLiteral
  : '"' (~["\\] | '\\' .)* '"'
  | '\'' (~['\\] | '\\' .)* '\''
  ;

NumberLiteral
  : [0-9]+ ('.' [0-9]+)?
  ;

Whitespace
  : [ \t\r\n]+ -> skip
  ;

LineComment
  : '//' ~[\r\n]* -> skip
  ;

BlockComment
  : '/*' .*? '*/' -> skip
  ;

import { ArrayMaxSize, IsArray, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateCardDto {
  @IsString()
  bookTitle!: string;

  @IsOptional()
  @IsString()
  oneLineReview?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  hashtags?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string; 

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const getAll100 = query({
  handler: async (ctx): Promise<Doc<"items">[]> => {
    return await ctx.db.query("items").take(100);
  },
});

export const searchItem = mutation({
  args: {
    input: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("items")
      .withSearchIndex("search_name", (q) => {
        return q.search("name", args.input);
      })
      .collect();
  },
});

export const getItem = query({
  args: {
    items_id: v.id("items"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.items_id);
  },
});

export const createItem = mutation({
  args: {
    kp_id: v.number(),
    name: v.string(),
    poster: v.string(),
    seriesLength: v.number(),
    type: v.string(),
    rating: v.object({
      kp: v.number(),
      imdb: v.number(),
    }),
    ageRating: v.number(),
    backdrop: v.string(),
    genres: v.array(v.string()),
    movieLength: v.number(),
    year: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"items">> => {
    const buffer = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("kp_id"), args.kp_id))
      .collect();

    if (buffer.length > 0) {
      return buffer[0]._id;
    }
    return await ctx.db.insert("items", {
      kp_id: args.kp_id,
      name: args.name,
      poster: args.poster,
      seriesLength: args.seriesLength,
      type: args.type,
      rating: args.rating,
      ageRating: args.ageRating,
      backdrop: args.backdrop,
      genres: args.genres,
      movieLength: args.movieLength,
      year: args.year,
      description: args.description,
    });
  },
});

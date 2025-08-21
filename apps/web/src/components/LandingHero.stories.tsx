import LandingHero from './LandingHero';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LandingHero> = {
	title: 'Landing/Hero',
	component: LandingHero,
	argTypes: {
		hue: { control: { type: 'number', min: 0, max: 360 } },
		spotlightIntensity: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
		motionEnabled: { control: 'boolean' }
	}
};

export default meta;

type Story = StoryObj<typeof LandingHero>;

export const Default: Story = {
	args: { hue: 210, spotlightIntensity: 0.78, motionEnabled: true }
};

export const WarmMoon: Story = {
	args: { hue: 30, spotlightIntensity: 0.85, motionEnabled: true }
};

export const ColdMoonNoMotion: Story = {
	args: { hue: 220, spotlightIntensity: 0.7, motionEnabled: false }
};
